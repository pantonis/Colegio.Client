import { Component, ViewChild, Injector, ElementRef, OnInit } from '@angular/core';

import {
    EstudianteDto, EstudianteServiceProxy, NacionalidadServiceProxy, NacionalidadDto, TelefonoEstudianteDto,
    TipoTelefonoDto, EmailEstudianteDto, TipoEmailDto, DireccionEstudianteDto, FamiliarEstudianteDto
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SexoArray } from '@app/inscripcion/shared/inscripcion-arrays';
import { NgxDatatableHelper } from '@shared/helpers/NgxDatatableHelper';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-create-estudiante',
    templateUrl: './create-estudiante.component.html'
})
export class CreateEstudianteComponent extends AppComponentBase implements OnInit {

    @ViewChild('content') content: ElementRef;

    estudiante: EstudianteDto = new EstudianteDto();
    nacionalidades: NacionalidadDto[];
    tiposTelefono: TipoTelefonoDto[];
    tiposEmail: TipoEmailDto[];
    telefonosEstudiante: TelefonoEstudianteDto[] = [];
    emailsEstudiante: EmailEstudianteDto[] = [];
    direccionesEstudiante: DireccionEstudianteDto[] = [];
    familiares: FamiliarEstudianteDto[] = [];
    model = new Date();
    active = false;
    saving = false;

    sexo = SexoArray.Sexo;
    estadoCivil = SexoArray.EstadoCivil;
    ngxDatatableHelper = NgxDatatableHelper;

    indexElementoSeleccionado = -1;
    elementoLista: any;
    elementoSelect: any;

    public modal: NgbModalRef;

    constructor(
        injector: Injector,
        private _router: Router,
        private _estudianteService: EstudianteServiceProxy,
        private _nacionalidadService: NacionalidadServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.obtenerNacionalidades();
        this.obtenerValoresDefecto();
    }

    save(form: NgForm): void {
        if (form.valid) {

            this.agregarRelaciones();
            this.saving = true;
            this._estudianteService.create(this.estudiante)
                .pipe(finalize(() => { this.saving = false; }))
                .subscribe(() => {
                    this.notify.info(this.l('Registrado exitosamente'), this.l('Completado'));
                    this.close();
                });
        } else {
            this.notify.warn(this.l('Complete los valores requeridos'), this.l('Corregir'), { preventDuplicates: true });
        }
    }

    obtenerNacionalidades() {
        this._nacionalidadService.getAllForSelect()
            .subscribe((result: NacionalidadDto[]) => {
                this.nacionalidades = result;
            });
    }

    obtenerValoresDefecto() {
        this.estudiante.init({ estado: 1 });
    }

    agregarRelaciones() {
        this.estudiante.listaTelefonos = this.telefonosEstudiante;
        this.estudiante.listaEmail = this.emailsEstudiante;
        this.estudiante.listaDireccionEstudiante = this.direccionesEstudiante;
    }

    close(): void {
        this.active = false;
        this._router.navigate(['app/inscripcion/estudiante'])
    }
}
