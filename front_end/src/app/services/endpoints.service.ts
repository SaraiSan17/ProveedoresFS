import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpParameterCodec} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  private BaseURI = 'http://localhost:4000';
  private urlCreateAccount = this.BaseURI + '/users/register';
  private urlAuth = this.BaseURI + '/users/authenticate';
  private urlListProveedor = this.BaseURI + '/users';
  private urlCurrentUser = this.BaseURI + '/users/current';
  private urlBaseClient = this.BaseURI + '/client';
  private urlBaseProyecto = this.BaseURI + '/proyecto';
  private urlBaseMaterial = this.BaseURI + '/material';
  private urlBaseAsignacion = this.BaseURI + '/asignacion';
  private urlBaseFormato = this.BaseURI + '/formato';
  private urlBaseDocumento = this.BaseURI + '/documento';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(private apiClient: HttpClient) { }

  login(data:{}):Observable<any>{
    const params = JSON.stringify(data);
    const url = `${this.urlAuth}`;
    return this.apiClient.post(url, params, this.httpOptions)
  }
  //Inicia endpoints para usuarios y proveedores
  currentUser(): Observable<any> {
    const url = `${this.urlCurrentUser}`;

    return this.apiClient.get(url);
  }

  getUser(id: any): Observable<any> {
    const url = `${this.urlListProveedor}/${id}`;

    return this.apiClient.get(url);
  }

  createUser(data: {}): Observable<any> {
    const params = JSON.stringify(data);
    const url = `${this.urlCreateAccount}`;

    return this.apiClient.post(url, params, this.httpOptions);
  }

  updateUser(id: number,data: {}):Observable<any>{
    const params = JSON.stringify(data);
    const url = `${this.urlListProveedor}/${id}`;
    return this.apiClient.put(url,params, this.httpOptions)
  }
  
  listProveedor(): Observable<any>{
    const url = `${this.urlListProveedor}`;
    return this.apiClient.get(url)
  }
  //termina endpoints para usuarios y proveedores

  //inicia endpoitns para clientes
  listClientes(): Observable<any>{
    const url = `${this.urlBaseClient}`;
    return this.apiClient.get(url)
  }

  getCliente(id: any): Observable<any> {
    const url = `${this.urlBaseClient}/${id}`;

    return this.apiClient.get(url);
  }

  createCliente(data: {}): Observable<any> {
    const params = JSON.stringify(data);
    const url = `${this.urlBaseClient}/register`;

    return this.apiClient.post(url, params, this.httpOptions);
  }

  updateCliente(id: number,data: {}):Observable<any>{
    const params = JSON.stringify(data);
    const url = `${this.urlBaseClient}/${id}`;
    return this.apiClient.put(url,params, this.httpOptions)
  }
  //termina endpoints para clientes

  //inicia endpoitns para proyectos
  listProyectos(): Observable<any>{
    const url = `${this.urlBaseProyecto}`;
    return this.apiClient.get(url)
  }

  getProyecto(id: any): Observable<any> {
    const url = `${this.urlBaseProyecto}/${id}`;

    return this.apiClient.get(url);
  }

  createProyecto(data: {}): Observable<any> {
    const params = JSON.stringify(data);
    const url = `${this.urlBaseProyecto}/register`;

    return this.apiClient.post(url, params, this.httpOptions);
  }

  updateProyecto(id: number,data: {}):Observable<any>{
    const params = JSON.stringify(data);
    const url = `${this.urlBaseProyecto}/${id}`;
    return this.apiClient.put(url,params, this.httpOptions)
  }
  //termina endpoints para proyectos

  //inicia endpoitns para materiales
  listMaterials(): Observable<any>{
    const url = `${this.urlBaseMaterial}`;
    return this.apiClient.get(url)
  }

  getMaterial(id: any): Observable<any> {
    const url = `${this.urlBaseMaterial}/${id}`;

    return this.apiClient.get(url);
  }

  createMaterial(data: {}): Observable<any> {
    const params = JSON.stringify(data);
    const url = `${this.urlBaseMaterial}/register`;

    return this.apiClient.post(url, params, this.httpOptions);
  }

  updateMaterial(id: number,data: {}):Observable<any>{
    const params = JSON.stringify(data);
    const url = `${this.urlBaseMaterial}/${id}`;
    return this.apiClient.put(url,params, this.httpOptions)
  }
  //termina endpoints para materiales
  
  //inicia endpoitns para asignaciones
  listAsignacion(): Observable<any>{
    const url = `${this.urlBaseAsignacion}`;
    return this.apiClient.get(url)
  }

  getAsignacion(id: any): Observable<any> {
    const url = `${this.urlBaseAsignacion}/${id}`;

    return this.apiClient.get(url);
  }

  createAsignacion(data: {}): Observable<any> {
    const params = JSON.stringify(data);
    const url = `${this.urlBaseAsignacion}/register`;

    return this.apiClient.post(url, params, this.httpOptions);
  }

  updateAsignacion(id: number,data: {}):Observable<any>{
    const params = JSON.stringify(data);
    const url = `${this.urlBaseAsignacion}/${id}`;
    return this.apiClient.put(url,params, this.httpOptions)
  }
  //termina endpoints para asignaciones
  
  //inicia endpoitns para formato
  listFormato(): Observable<any>{
    const url = `${this.urlBaseFormato}`;
    return this.apiClient.get(url)
  }
  
  getFormato(id: any): Observable<any> {
    const url = `${this.urlBaseFormato}/${id}`;

    return this.apiClient.get(url);
  }

  createFormato(data: {}): Observable<any> {
    const params = JSON.stringify(data);
    const url = `${this.urlBaseFormato}/register`;

    return this.apiClient.post(url, params, this.httpOptions);
  }

  updateFormato(id: number,data: {}):Observable<any>{
    const params = JSON.stringify(data);
    const url = `${this.urlBaseFormato}/${id}`;
    return this.apiClient.put(url,params, this.httpOptions)
  }
  //termina endpoints para formato
  
  //inicia endpoitns para documento
  listDocumento(): Observable<any>{
    const url = `${this.urlBaseDocumento}`;
    return this.apiClient.get(url)
  }

  getDocumento(id: any): Observable<any> {
    const url = `${this.urlBaseDocumento}/${id}`;

    return this.apiClient.get(url);
  }

  createDocumento(data: {}, file:File): Observable<any> {
    const params = JSON.stringify(data);
    const url = `${this.urlBaseDocumento}/register`;
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('file', file, file.name);
    this.httpOptions.headers.append("Content-Disposition", "form-data; name=\"data\"");
    this.httpOptions.headers.append("Content-Disposition", "form-data; name=\"file\"");
    return this.apiClient.post(url, formData);
  }

  updateDocumento(id: number,data: {}):Observable<any>{
    const params = JSON.stringify(data);
    const url = `${this.urlBaseDocumento}/${id}`;
    return this.apiClient.put(url,params, this.httpOptions)
  }
  //termina endpoints para Docuemento
}
