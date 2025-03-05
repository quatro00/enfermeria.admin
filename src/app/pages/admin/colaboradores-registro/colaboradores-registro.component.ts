import { Component } from '@angular/core';

@Component({
  selector: 'app-colaboradores-registro',
  templateUrl: './colaboradores-registro.component.html',
  styleUrls: ['./colaboradores-registro.component.css'],
  styles: [`
    :host ::ng-deep .basic-select .ant-select-selector{
      @apply h-[50px] rounded-4 border-normal px-[20px] flex items-center dark:bg-white/10 dark:border-white/10 dark:text-white/60 dark:hover:text-white/100;
    }
    :host ::ng-deep .basic-select.ant-select-multiple .ant-select-selection-item{
        @apply bg-white dark:bg-white/10 border-normal dark:border-white/10;
      }
      ::ng-deep .ant-upload {
        @apply w-full;
      }
      :host ::ng-deep .basic-select .ant-select-multiple.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector{
        @apply dark:bg-white/10 dark:border-white/10 dark:text-white/60 dark:hover:text-white/100;
      }
    `]
})
export class ColaboradoresRegistroComponent {
  isVisible = false;
  isLoading = true;
  showContent = false;
  
  contratoMantenimientoId;
  searchValue = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {

    this.isLoading = false;
    this.showContent = true;
  }
}
