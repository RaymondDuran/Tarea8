import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  recording = false;
  storedFileNames = [];

  constructor(private storage: Storage, public photoService: PhotoService) { }

  // CUESTION MODAL
  isModalOpen = false;
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  // CUESTION FOTOS-CAMARA
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  async ngOnInit() {
    this.loadFiles();
    VoiceRecorder.requestAudioRecordingPermission();

    await this.storage.create();

    this.cargarVivencias();

  }

  // inputs modal
  public titulo: string = "";
  public descripcion: string = "";
  public fecha: string = "";
  vivencias = [];

  // Storage
  async cargarVivencias(){
    this.vivencias = [];
    this.storage.forEach((key, value, index) => {
      this.vivencias.unshift(key);
    });
  }

  async addVivencia(){
    this.fecha = "" + new Date().getDate()+ "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear();
    await this.loadFiles();
    const fotoFile = this.storedFileNames[this.storedFileNames.length - 1];
    const fotoPath = fotoFile.uri;

    

    await this.storage.set(this.titulo, {
      'titulo': this.titulo,
      'descripcion': this.descripcion,
      'fecha': this.fecha,
      'foto': fotoPath
    });
    this.cargarVivencias();
    this.setOpen(false);

    this.titulo = "";
    this.descripcion = "";
  }

  async loadFiles() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result => {
      console.log(result.files);
      this.storedFileNames = result.files;
    })
  }

  async borrarVivencias(){
    await this.storage.clear();
    this.cargarVivencias();
  }

  // Audio

  startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording();
  }

  stopRecording() {
    if (!this.recording){
      return;
    }
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if( result.value && result.value.recordDataBase64){
        const recordData = result.value.recordDataBase64;
        const fileName = new Date().getTime() + '.wav';
        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: recordData
        });
        this.loadFiles();
      }
    })
  }

  async playFile(fileName){
    const audioFile = await Filesystem.readFile({
      path:fileName,
      directory: Directory.Data
    });
    const base64Sound = audioFile.data;

    const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }



}