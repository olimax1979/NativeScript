import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { View } from "ui/core/view";
import { DatePipe } from '@angular/common';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Page } from "ui/page";
import * as enums from "ui/enums";

import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { CouchbaseService } from '../services/couchbase.service';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    res: any[];

    reservations: Array<string>;
    docId: string = "reservations";

    reserveTable: FormGroup;
    reservationForm: View;
    reservationData: View;
    showReservationForm: boolean = true;
    showReservationData: boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private _modalService: ModalDialogService, 
        private vcRef: ViewContainerRef,
        private page: Page,
        private couchbaseService: CouchbaseService)  {
            super(changeDetectorRef);

            this.reserveTable = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });
            this.res = [];
            this.reservations = [];

            let doc = this.couchbaseService.getDocument(this.docId);
            if( doc == null) {
                this.couchbaseService.createDocument({"reservations": []}, this.docId);
              }
              else {
                this.reservations = doc.reservations;
              }
            
    }

    ngOnInit() {

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reserveTable.patchValue({ smoking: true });
        }
        else {
            this.reserveTable.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reserveTable.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reserveTable.patchValue({ dateTime: textField.text});
    }

    onSubmit() {
        
        this.res.push(this.reserveTable.value);
        this.animateLeft();
        //console.log(this.res);
        //console.log(JSON.stringify(newArray));
        //console.log(Object.keys(this.res));
        //console.log(JSON.stringify(this.reserveTable.value));
    }

    onBackReserve() {

        this.showReservationData=false;
        this.showReservationForm=true;
        this.res.pop();
        this.reservationForm.animate({
            opacity: 1,
            scale: { x: 1, y: 1 },
            duration: 10,
        })
    }

    animateLeft() { 
        
            
              this.reservationForm = this.page.getViewById<View>('reservationForm');
              this.reservationData  = this.page.getViewById<View>('reservationData');
              
              if( this.showReservationForm ) {
                this.reservationForm.animate({
                  opacity: 0,
                  scale: { x: 0, y: 0 },
                  duration: 500,
                  
                })
                
                .then(() => {
                  this.showReservationForm=false;
                  this.reservationData.animate({
                    opacity: 0,
                    scale: { x: 0, y: 0 },
                    
                  })
                .then(() => {
                    this.showReservationData=true;
                    this.reservationData.animate({
                      opacity: 1,
                      scale: { x: 1, y: 1 },
                      duration: 500,
                    
                })
            })
                  
                });
              }
              
            }
        
    createModalView(args) {
        
                let options: ModalDialogOptions = {
                    viewContainerRef: this.vcRef,
                    context: args,
                    fullscreen: false
                };
        
                this._modalService.showModal(ReservationModalComponent, options)
                    .then((result: any) => {
                        if (args === "guest") {
                            this.reserveTable.patchValue({guests: result});
                        }
                        else if (args === "date-time") {
                            this.reserveTable.patchValue({ dateTime: result});
                        }
                    });
        
            }
}