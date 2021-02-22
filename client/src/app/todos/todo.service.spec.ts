import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  // A small collection of test users
  const testTodos: Todo[] = [
    {
      _id: 'chris_id',
      owner: 'Chris',
      status: false,
      body: 'In sunt ex non tempor cillum commodo amet incididunt enim qui commodo quis.',
      category: 'groceries'
    },
    {
      _id: 'pat_id',
      owner: 'Pat',
      status: true,
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
      category: 'video games'
    },
    {
      _id: 'jamie_id',
      owner: 'Jamie',
      status: true,
      body: 'Incididunt enim ea sit qui esse magna eu.',
      category: 'homework'
    }
  ];
  let todoService: TodoService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getTodos()', () => {

    it('calls `api/todos` when `getTodos()` is called with no parameters', () => {
      // Assert that the todos we get from this call to getTodos()
      // should be our set of test todos. Because we're subscribing
      // to the result of getTodos(), this won't actually get
      // checked until the mocked HTTP request 'returns' a response.
      // This happens when we call req.flush(testTodos) a few lines
      // down.
      todoService.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(todoService.todosUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testTodos);
    });

    describe('Calling getTodos() with parameters correctly forms the HTTP request', () => {
      /*
       * We really don't care what `getTodos()` returns in the cases
       * where the filtering is happening on the server. Since all the
       * filtering is happening on the server, `getTodos()` is really
       * just a "pass through" that returns whatever it receives, without
       * any "post processing" or manipulation. So the tests in this
       * `describe` block all confirm that the HTTP request is properly formed
       * and sent out in the world, but don't _really_ care about
       * what `getTodos()` returns as long as it's what the HTTP
       * request returns.
       *
       * So in each of these tests, we'll keep it simple and have
       * the (mocked) HTTP request return the entire list `testTodos`
       * even though in "real life" we would expect the server to
       * return return a filtered subset of the users.
       */

      it('correctly calls api/todos with filter parameter \'owner\'', () => {
        todoService.getTodos({ owner: 'Chris' }).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the owner parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todosUrl) && request.params.has('owner')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role parameter was 'owner'
        expect(req.request.params.get('owner')).toEqual('Chris');

        req.flush(testTodos);
      });

      it('correctly calls api/todos with filter parameter \'limit\'', () => {

        todoService.getTodos({ limit: 25 }).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the limit parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todosUrl) && request.params.has('limit')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the age parameter was '25'
        expect(req.request.params.get('limit')).toEqual('25');

        req.flush(testTodos);
      });

      it('correctly calls api/todos with multiple filter parameters', () => {

        todoService.getTodos({ owner: 'Chris', limit: 25, sort: 'category'}).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the owner and limit parameters.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todosUrl)
            && request.params.has('owner') && request.params.has('limit')  && request.params.has('orderBy')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role parameters are correct
        expect(req.request.params.get('owner')).toEqual('Chris');
        expect(req.request.params.get('limit')).toEqual('25');
        expect(req.request.params.get('orderBy')).toEqual('category');

        req.flush(testTodos);
      });
    });
  });

  describe('getTodoByID()', () => {
    it('calls api/todos/id with the correct ID', () => {
      // We're just picking a todo "at random" from our little
      // set of Users up at the top.
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      todoService.getTodoById(targetId).subscribe(
        // This `expect` doesn't do a _whole_ lot.
        // Since the `targetTodo`
        // is what the mock `HttpClient` returns in the
        // `req.flush(targetTodo)` line below, this
        // really just confirms that `getUserById()`
        // doesn't in some way modify the user it
        // gets back from the server.
        todo => expect(todo).toBe(targetTodo)
      );

      const expectedUrl: string = todoService.todosUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });

  describe('filterTodos()', () => {
    /*
     * Since `filterTodos` actually filters "locally" (in
     * Angular instead of on the server), we do want to
     * confirm that everything it returns has the desired
     * properties. Since this doesn't make a call to the server,
     * though, we don't have to use the mock HttpClient and
     * all those complications.
     */
    it('filters by status', () => {
      const todosStatus = 'complete';
      const filteredTodos = todoService.filterTodos(testTodos, { status: todosStatus });
      // There should be two todos with a true status
      expect(filteredTodos.length).toBe(2);
      // Every returned todos status should be true.
      filteredTodos.forEach(todo => {
        expect(todo.status.toString() === todosStatus);
      });
    });

    it('filters by status', () => {
        const todosStatus = 'incomplete';
        const filteredTodos = todoService.filterTodos(testTodos, { status: todosStatus });
        // There should be two todos with a true status
        expect(filteredTodos.length).toBe(1);
        // Every returned todos status should be true.
        filteredTodos.forEach(todo => {
          expect(todo.status.toString() === todosStatus);
        });
      });

    it('filters by category', () => {
      const todoCategory = 'groceries';
      const filteredTodos = todoService.filterTodos(testTodos, { category: todoCategory });
      // There should be just one user that has fast food as their category.
      expect(filteredTodos.length).toBe(1);
      // Every returned user's company should contain 'fast food'.
      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by body', () => {
      const todoBody = 'enim';
      const filteredTodos = todoService.filterTodos(testTodos, { body: todoBody });
      // There should be two todos that have a body that contains 'enim';
      expect(filteredTodos.length).toBe(2);
      // Every returned todos should have a body that contains enim
      filteredTodos.forEach(todo => {
        expect(todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by status and category', () => {
      // There's only one todo (Pat) whose status
      // is false and whose category is video games
      const todoStatus = 'complete';
      const todoCategory = 'homework';
      const filters = { status: todoStatus, category: todoCategory};
      const filteredTodos = todoService.filterTodos(testTodos, filters);
      // There should be just one todo with these properties.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo should have _both_ these properties.
      filteredTodos.forEach(todo => {
        expect(todo.status.toString() === todoStatus);
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
