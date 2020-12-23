import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

import {ConfirmationService} from 'primeng/api';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css'],
  providers: [MessageService]
})

export class ItemSearchComponent implements OnInit {

    items = [];
    inputSearch;

    constructor(
         private itemService: ItemService,
         private confirmationService: ConfirmationService,
         private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.loadItems();
    }

    dialogDelete(item) {
        this.confirmationService.confirm({
            message: 'Seguro que quiere eliminar este item?',
            acceptLabel: 'Si',
            rejectLabel: 'No',
            header: 'Confirmacion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteItem(item);
            },
            reject: () => {
            }
        });
    }
    
    private loadItems() {
        let apiItems=[];
        this.itemService.getApiItems().subscribe(
            result=>{
                apiItems=result.result.items;        
                apiItems.forEach(p=>this.itemService.save(p));
                this.items=apiItems;

                let memoryItems=[];
                this.itemService.getItemsInMemory()
                .then(resultItems => {
                    memoryItems = resultItems;
                    this.items=this.items.concat(memoryItems);
                })
                .catch(error => {
                console.log(error);
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'No fue posible cargar los items'});
                });

            },
            error=>{
              console.log("ERROR AL LISTAR ITEMS !!!! ");
            }
      
      
          );


       
    }
    

        
/*        
 this.itemService.getItemsInMemory()
            .then(items => {
                this.items = items;
            })
            .catch(error => {
                this.messageService.add({severity: 'error', summary: 'Erro', detail: 'No fue posible cargar los items'});
        });        






let apiItems=[];
        
        this.itemService.getApiItems().subscribe(
            result=>{
                apiItems=result.result.items;        
                apiItems.forEach(p=>this.itemService.save(p));
                this.items=apiItems;

                let memoryItems=[];
                this.itemService.getItemsInMemory()
                .then(resultItems => {
                    memoryItems = resultItems;
                    this.items=this.items.concat(memoryItems);
                })
                .catch(error => {
                console.log(error);
                this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os itens. Tente novamente'});
                });

            },
            error=>{
              console.log("ERROR AL LISTAR ITEMS !!!! ");
            }
      
      
          );
  
  
  
    
        }
          */       
        
    

    private deleteItem(item) {
        this.itemService.delete(item.id).then(_ => {
            this.loadItems();
            this.messageService.add({severity: 'info', summary: 'Exito', detail: 'Operacion efectuada exitosamente!'});
        }).catch(error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'No fue posible cargar los items,intente nuevamente'});
        });
    }

}
