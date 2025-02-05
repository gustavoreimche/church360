import { inject, Injectable } from '@angular/core';
import { ToasterService } from '../services/toaster.service';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Observable, OperatorFunction, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SupabaseErrorService {
  toaster = inject(ToasterService);
  router = inject(Router);

  handleError<E>(error: PostgrestSingleResponse<E>) {
    let message = 'Erro inesperado. Tente novamente mais tarde.';

    if (error.error) {
      switch (error.error.code) {
        case '23505':
          message = 'Conflito de registro: já existe um registro com esses dados.';
          break;
        case 'PGRST116':
          message = 'O payload da requisição é muito grande.';
          break;
        case 'PGRST502':
          message = 'Violação de chave estrangeira: verifique as referências dos dados.';
          break;
        default:
          switch (error.status) {
            case 400:
              message = 'Requisição inválida. Verifique os dados enviados.';
              break;
            case 401:
              message = 'Não autorizado. Faça login para continuar.';
              this.router.navigate(['/login']);
              break;
            case 403:
              message = 'Proibido. Você não tem permissão para realizar esta ação.';
              break;
            case 404:
              message = 'Recurso não encontrado.';
              break;
            case 409:
              message = 'Conflito de registro: possível duplicação de dados.';
              break;
            case 500:
              message = 'Erro interno do servidor. Tente novamente mais tarde.';
              break;
            default:
              message = `Erro inesperado: ${error.error.message || 'Tente novamente mais tarde.'}`;
          }
      }
    }

    this.toaster.error(message);
  }
}

export function handleSupabaseError<T>(
  errorHandler: SupabaseErrorService,
): OperatorFunction<PostgrestSingleResponse<T>, T> {
  return (source: Observable<PostgrestSingleResponse<T>>) => {
    return source.pipe(
      map(response => {
        if (response.error) {
          errorHandler.handleError<T>(response);
          throw response.error;
        }
        return response.data;
      }),
      catchError(err => {
        return throwError(() => err);
      }),
    );
  };
}
