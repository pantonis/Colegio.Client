import { Component, ViewChild, Injector, ElementRef, OnInit } from '@angular/core';
import { TipoIdentificacionDto, TipoIdentificacionServiceProxy} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-tipo-identificacion',
  templateUrl: './create-tipo-identificacion.component.html'
})
export class CreateTipoIdentificacionComponent extends AppComponentBase implements OnInit {


    @ViewChild('content') content: ElementRef;

    active = false;
    saving = false;
    tipoIdentificacion: TipoIdentificacionDto = new TipoIdentificacionDto();

    constructor(
        injector: Injector,
        private _router: Router,
        private _tipoIdentificacionService: TipoIdentificacionServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {

    }

    save(form: NgForm): void {

        if (form.valid) {

            this.saving = true;
            this._tipoIdentificacionService.create(this.tipoIdentificacion)
                .pipe(finalize(() => { this.saving = false; }))
                .subscribe(() => {
                    this.notify.info(this.l('Registrado exitosamente'), this.l('Completado'));
                    this.close();
                });
        } else {
            this.notify.warn(this.l('Complete los valores requeridos'), this.l('Corregir'), { preventDuplicates: true } );
        }
    }

    close(): void {
        this.active = false;
        this._router.navigate(['app/generales/tipo-identificacion'])
    }
}
