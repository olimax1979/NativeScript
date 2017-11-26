import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { TextField } from 'ui/text-field';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Page } from 'ui/page';


@Component({
    
    moduleId: module.id,
    templateUrl: './comment.component.html'
})

export class CommentComponent implements OnInit {

    commentForm: FormGroup;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private params: ModalDialogParams,
        private page: Page,)  {
            
            this.commentForm = this.formBuilder.group({
                author: ['', Validators.required],
                rating: 5,
                comment: ['', Validators.required]
            });

            
            this.page.on("unloaded", () => {
                // using the unloaded event to close the modal when there is user interaction
                // e.g. user taps outside the modal page
                console.log("unloaded")
                this.params.closeCallback();
            });
    }

    ngOnInit() {
        
    }

    onSubmit() {
        this.commentForm.value.date=new Date().toISOString();
        this.params.closeCallback(this.commentForm.value);
    }

    onClose() {
        this.page.closeModal();
    }
}
