import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { orpc } from '@/utils/orpc'
import { useMutation, useQuery } from '@tanstack/react-query'

export default function Todos() {
  const [newTodoText, setNewTodoText] = useState('')

  const todos = useQuery(orpc.todo.getAll.queryOptions())
  const createMutation = useMutation(
    orpc.todo.create.mutationOptions({
      onSuccess: () => {
        todos.refetch()
        setNewTodoText('')
      },
    }),
  )
  const toggleMutation = useMutation(
    orpc.todo.toggle.mutationOptions({
      onSuccess: () => todos.refetch(),
    }),
  )
  const deleteMutation = useMutation(
    orpc.todo.delete.mutationOptions({
      onSuccess: () => todos.refetch(),
    }),
  )

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodoText.trim()) {
      createMutation.mutate({ text: newTodoText })
    }
  }

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed })
  }

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate({ id })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTodo}>
            <Input
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              disabled={createMutation.isPending}
            />
            <Button
              type="submit"
              disabled={createMutation.isPending || !newTodoText.trim()}
            >
              {createMutation.isPending ? <Loader2 /> : 'Add'}
            </Button>
          </form>

          {todos.isLoading ? (
            <div>
              <Loader2 />
            </div>
          ) : todos.data?.length === 0 ? (
            <p>No todos yet. Add one above!</p>
          ) : (
            <ul>
              {todos.data?.map(todo => (
                <li key={todo.id}>
                  <div>
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() =>
                        handleToggleTodo(todo.id, todo.completed)
                      }
                      id={`todo-${todo.id}`}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`${todo.completed ? 'line-through' : ''}`}
                    >
                      {todo.text}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                    aria-label="Delete todo"
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
