import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';


@Injectable()
export class TodoService {
  readonly todosUrl: string = environment.apiUrl + 'todos';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(): Observable<Todo[]> {
    const httpParams: HttpParams = new HttpParams();


    return this.httpClient.get<Todo[]>(this.todosUrl, {params: httpParams,});
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todosUrl + '/' + id);
  }

  filterTodos(todos: Todo[], filters: {status?: string }): Todo[] {
    let filteredTodos = todos;

    if (filters.status) {
      if (filters.status.toString().toLocaleLowerCase() === 'complete') {
        filters.status = 'true';
      } else {
        filters.status = 'false';
      }
      filteredTodos = filteredTodos.filter(todo => todo.status.toString().indexOf(filters.status) !== -1);
    }

    return filteredTodos;
  }
}
