import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CalificacionDto, CalificacionServiceProxy, PagedResultDtoOfCalificacionDto } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageHelper } from '@app/shared/MessageHelper';
import { NgxDatatableHelper } from '@shared/helpers/NgxDatatableHelper';

@Component({
    templateUrl: './calificacion.component.html',
    animations: [appModuleAnimation()]
})
export class CalificacionComponent extends PagedListingComponentBase<CalificacionDto> {

    ngxDatatableHelper = NgxDatatableHelper;

    active = false;
    calificaciones: CalificacionDto[] = [];
    filter = '';
    sorting = '';
    totalCount: number;
    selected = [];
    selectedCount = 0;

    constructor(
        injector: Injector,
        private _router: Router,
        private _calificacionService: CalificacionServiceProxy
    ) {
        super(injector);
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this._calificacionService.getAllFiltered(this.sorting, request.skipCount, request.maxResultCount, this.filter)
            .pipe(finalize(() => {
                 finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfCalificacionDto) => {
                this.calificaciones = result.items;
                this.totalCount = result.items.length;
                this.showPaging(result, pageNumber);
            });
    }

    protected delete(calificacion: CalificacionDto): void {
        MessageHelper.confirm(
            'Se eliminará la calificación para el estudiante:' + calificacion.estudianteNombreCompleto,
            '¿Desea borrarlo?',
            () => {
                    this._calificacionService.delete(calificacion.id)
                        .subscribe(() => {
                            abp.notify.info('Calificación borrada exitosamente');
                            this.refresh();
                        });
                }
        );
    }

    createCalificacion(): void {
        this._router.navigate(['/app/notas/calificacion/create-calificacion'])
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
