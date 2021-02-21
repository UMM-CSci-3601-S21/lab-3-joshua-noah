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

  getTodos(filters?: { owner?: string; limit?: number; sort?: string}): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.owner);
      }
      if (filters.limit) {
        httpParams = httpParams.set('limit', filters.limit.toString());
      }
      if (filters.sort) {
        httpParams = httpParams.set('orderBy', filters.sort);
      }
    }
    return this.httpClient.get<Todo[]>(this.todosUrl, {params: httpParams,});
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todosUrl + '/' + id);
  }

  filterTodos(todos: Todo[], filters: {status?: boolean; body?: string; category?: string }): Todo[] {
    let filteredTodos = todos;
    if (filters.status) {
      if (filters.status.toString().toLocaleLowerCase() === 'complete') {
        filters.status = true;
      } else {
        filters.status = false;
      }
      filteredTodos = filteredTodos.filter(todo => todo.status.toString().indexOf(filters.status.toString().toLowerCase()) !== -1);
    }
    if (filters.body) {
      filters.body = filters.body.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }
    if (filters.category) {
      filters.category = filters.category.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => todo.category.toLowerCase().indexOf(filters.category) !== -1);
    }

    return filteredTodos;
  }
}
