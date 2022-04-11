import { DbfireService } from './../services/dbfire.service';
import { DatePipe } from '@angular/common';
import { ModalController, ToastController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @Input() obj: any;
  @Input() titulo: string;
  nombre: string = '';
  fecha: string;
  hora: any;

  constructor(
    private modalCtrl: ModalController, 
    private database: DbfireService,
    private datePipe: DatePipe,
    private toastController: ToastController) { }

  ngOnInit() {
    if(this.obj?.id.length > 0){
      console.log(this.obj.id)
      this.nombre = this.obj.nombre;
      //console.log(this.datePipe.transform(this.obj.sesion.toDate(), 'yyyy-MM-dd'));
      this.fecha = this.datePipe.transform(this.obj.sesion.toDate(), 'yyyy-MM-dd');
      this.hora = this.datePipe.transform(this.obj.sesion.toDate(), 'HH:mm');
      console.log(this.hora);
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    //console.log(this.nombre, this.fecha, this.hora);
    let fecha = new Date(this.fecha + ' ' + this.hora);
    const data = {
      nombre: this.nombre,
      sesion: fecha
    }
    if(this.obj?.id.length > 0){
      this.database.update('items', this.obj.id, data).then(res => {
        this.cerrarModal();
        this.mostrarMensaje('Se modifico el registro con éxito');
      }).catch(err => {
        console.log("Error al modificar: ", err)
      })
    } else {
      this.database.create('items', data).then(res => {
        this.cerrarModal();
        this.mostrarMensaje('Información creada con éxito');
      }).catch(err => {
        console.log("error en alta: ", err);
      });
    }
  }

  async mostrarMensaje(message, color='success', duration=3000){
    const toast = await this.toastController.create({
      message,
      color,
      duration
    });
    toast.present();
  }

}
