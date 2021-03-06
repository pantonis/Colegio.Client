import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ProfesionDto, ProfesionServiceProxy, PagedResultDtoOfProfesionDto } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageHelper } from '@app/shared/MessageHelper';
import { NgxDatatableHelper } from '@shared/helpers/NgxDatatableHelper';

@Component({
    templateUrl: './profesion.component.html',
    animations: [appModuleAnimation()]
})
export class ProfesionComponent extends PagedListingComponentBase<ProfesionDto> {

    ngxDatatableHelper = NgxDatatableHelper;

    active = false;
    profesions: ProfesionDto[] = [];
    filter = '';
    sorting = '';
    totalCount: number;
    selected = [];
    selectedCount = 0;

    constructor(
        injector: Injector,
        private _router: Router,
        private _profesionService: ProfesionServiceProxy
    ) {
        super(injector);
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._profesionService.getAllFiltered(this.sorting, request.skipCount, request.maxResultCount, this.filter)
            .pipe(finalize(() => {
                 finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfProfesionDto) => {
                this.profesions = result.items;
                this.totalCount = result.items.length;
                this.showPaging(result, pageNumber);
            });
    }

    protected delete(profesion: ProfesionDto): void {
        MessageHelper.confirm(
            'Se eliminará la profesion:' + profesion.descripcion,
            '¿Desea borrarlo?',
            () => {
                    this._profesionService.delete(profesion.id)
                        .subscribe(() => {
                            abp.notify.info('profesion borrada exitosamente');
                            this.refresh();
                        });
                }
        );
    }

    createProfesion(): void {
        this._router.navigate(['/app/generales/profesion/create-profesion'])
    }

    goBack(): void {
        this._router.navigate(['/app/dashboard']);
    }

    searchData(filter: string ): void {

        this.filter = filter;
        this.pageNumber = 0;
        this.isTableLoading = true;
        this.refresh();
    }

    onSelect({ selected }) {
        this.selected = selected
        this.selectedCount = selected.length;
        this.ngxDatatableHelper.selectedCountMessages(this.selectedCount);
    }

    onSort(event: any) {
        this.sorting = event.sorts[0].prop + ' ' + event.sorts[0].dir;
        this.getDataPage(0);
    }

    onPageChange(event: any)  {
        this.getDataPage(event.offset);
    }
}
