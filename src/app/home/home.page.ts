import { RegisterPage } from './../register/register.page';
import { DbfireService } from './../services/dbfire.service';
import { Component } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  factual = new Date();
  items: any[] = [];
  obj = {
    id: '',
    nombre: '',
    fecha: '',
    hora: ''
  }

  constructor(
    private database: DbfireService, 
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController) {}

  ionViewDidEnter(){
    this.database.getAll('items').then(
      firebaseResp => {
        firebaseResp.subscribe(data => {
          this.items = [];
          data.forEach((element: any) => {
            this.items.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            })
          });
          console.log(this.items);
        });
      }
    );
  } 

  async eliminar(id) {
    const alert = await this.alertController.create({
      header: '!!Alerta¡¡',
      message: '¿Esta seguro de eliminar el registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.database.delete('items', id).then(res => {
              this.mostrarMensaje('Se eliminó con éxito');
            }).catch(err => {
              console.log("ERROR al eliminar ", err);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarMensaje(message, color='success', duration=3000){
    const toast = await this.toastController.create({
      message,
      color,
      duration
    });
    toast.present();
  }

  async modalRegister() {
    const modal = await this.modalController.create({
      component: RegisterPage,
      componentProps: {
        titulo: 'Registro',
        obj: this.obj
      },
      showBackdrop: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async presentModal(data : any) {
    const modal = await this.modalController.create({
      component: RegisterPage,
      componentProps: {
        titulo: 'Edición',
        obj: data
      },
      showBackdrop: true,
      backdropDismiss: false
    });
    return await modal.present();
  }
}
