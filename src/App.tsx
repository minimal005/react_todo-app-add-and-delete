import React, { useState, useEffect, useCallback } from 'react';
import * as todosService from './api/todos';

import { ErrorMessages } from './components/ErrorsMessage';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

import { Todo } from './types/Todo';
import { Field } from './types/Field';
import { preparedTodos } from './service/service';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosCounter, setTodosCounter] = useState<number>(0);
  const [field, setField] = useState<Field>(Field.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isDeleted, setIsDeleted] = useState(false);
  const [todosForDelete, setTodosForDelete] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => setErrorMessage(''), 4000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    const todosActive = todos.filter(todo => !todo.completed);

    setTodosCounter(todosActive.length);
  }, [todos]);

  const filteredTodos = preparedTodos(todos, field);

  const changeComplete = useCallback(
    (todoChanged?: Todo) => {
      const changedTodos = todos.map(todo => {
        if (!todoChanged) {
          return { ...todo, completed: !todo.completed };
        }

        if (todo.id !== todoChanged.id) {
          return todo;
        } else {
          return { ...todo, completed: !todo.completed };
        }
      });

      setTodos(changedTodos);
    },
    [todos],
  );

  const addTempTodo = useCallback((temporaryTodo: Todo | null) => {
    if (temporaryTodo) {
      setTempTodo({ ...temporaryTodo, id: 0 });
    } else {
      setTempTodo(null);
    }
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    setTodosForDelete(completedTodos);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          todosCounter={todosCounter}
          changeComplete={changeComplete}
          setErrorMessage={setErrorMessage}
          addTempTodo={addTempTodo}
          isDeleted={isDeleted}
        />

        {todos && (
          <TodoList
            filteredTodos={filteredTodos}
            changeComplete={changeComplete}
            setTodos={setTodos}
            tempTodo={tempTodo}
            setIsDeleted={setIsDeleted}
            setErrorMessage={setErrorMessage}
            todosForDelete={todosForDelete}
          />
        )}

        {!!todos.length && (
          <Footer
            field={field}
            setField={setField}
            todosCounter={todosCounter}
            isCompleted={todosCounter === todos.length}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorMessages
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
