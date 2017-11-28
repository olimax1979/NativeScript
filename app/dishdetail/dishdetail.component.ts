import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { FavoriteService } from '../services/favorite.service';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Toasty } from 'nativescript-toasty';
import { action } from "ui/dialogs";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { CommentComponent } from "../comment/comment.component";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  moduleId: module.id,
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  comment: Comment;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;
  
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private favoriteservice: FavoriteService,
    private fonticon: TNSFontIconService, 
    private _modalService: ModalDialogService, 
    private vcRef: ViewContainerRef,
    @Inject('BaseURL') private BaseURL) { }

    ngOnInit() {
      
          this.route.params
            .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
            .subscribe(dish => { 
                this.dish = dish;
                this.favorite = this.favoriteservice.isFavorite(this.dish.id);
                this.numcomments = this.dish.comments.length;
      
                let total = 0;
                this.dish.comments.forEach(comment => total += comment.rating);
                this.avgstars = (total/this.numcomments).toFixed(2);
              },
              errmess => { this.dish = null; this.errMess = <any>errmess; });
        }
      
        addToFavorites() {
          if (!this.favorite) {
            console.log('Adding to Favorites', this.dish.id);
            this.favorite = this.favoriteservice.addFavorite(this.dish.id);
            const toast = new Toasty ("Added Dish "+ this.dish.id, "short", "bottom");
            toast.show();
          }
        }

        goBack(): void {
          this.routerExtensions.back();
          
        }

        dispActionDialog() {
          let options = {
              title: "Actions",
              cancelButtonText: "Cancel",
              actions: ["Add to Favorites", "Add Comment"]
          };
  
          action(options).then((result) => {
              console.log(result);
              if(result == "Add to Favorites"){
                this.addToFavorites();
            }
              else if(result == "Add Comment"){
                this.createCommentModalView();
            }
          });

        }

        createCommentModalView(): void {
          
          const options: ModalDialogOptions = {
              viewContainerRef: this.vcRef,
              context: {},
              fullscreen: false,
          };
      
           this._modalService.showModal(CommentComponent, options)
           .then((comment: Comment) => {
            if (comment) {
            console.log(JSON.stringify(this.comment));
            this.dish.comments.push(comment);
            
            //update the average rating, too
            this.numcomments = this.dish.comments.length;
            let total = 0;
            this.dish.comments.forEach(comment => total += comment.rating);
            this.avgstars = (total / this.numcomments).toFixed(2);
            }
        });
    }
    
  }
              
              
