import React, { Dispatch, SetStateAction } from 'react';
import { Form } from './Form';

import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  todosCounter: number;
  changeComplete: (todo?: Todo) => void;
  setErrorMessage: (error: string) => void;
  addTempTodo: (todo: Todo | null) => void;
  isDeleted: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  todosCounter,
  changeComplete,
  setErrorMessage,
  addTempTodo,
  isDeleted,
}) => {
  return (
    <header className="todoapp__header">
      {todos && (
        <button
          onClick={() => changeComplete}
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todosCounter === todos.length,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <Form
        setTodos={setTodos}
        setErrorMessage={setErrorMessage}
        addTempTodo={addTempTodo}
        isDeleted={isDeleted}
      />
    </header>
  );
};
