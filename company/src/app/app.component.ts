import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'company';
  uploadedFile: any;
  reader = new FileReader();

  @ViewChild('fileInputLabel')
  fileInputLabel: ElementRef;

  onFileChange(files: FileList) {
    this.fileInputLabel.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.uploadedFile = files.item(0);

    this.reader.readAsText(this.uploadedFile);
    this.reader.onload = this.readSuccess;

    console.log('file', this.uploadedFile);
  }

  readSuccess(evt) {
    let jsonData = JSON.parse(evt.target.result);
    console.log(jsonData.signedData);
  }

}
