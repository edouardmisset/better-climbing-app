import { authClient } from '@/lib/auth-client'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import Loader from './loader'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void
}) {
  const navigate = useNavigate()
  const { isPending } = authClient.useSession()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate('/dashboard')
            toast.success('Sign up successful')
          },
          onError: error => {
            toast.error(error.error.message)
          },
        },
      )
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
    },
  })

  if (isPending) {
    return <Loader />
  }

  return (
    <div>
      <h1>Create Account</h1>

      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <div>
          <form.Field name="name">
            {field => (
              <div>
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map(error => (
                  <p key={error?.message}>{error?.message}</p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {field => (
              <div>
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map(error => (
                  <p key={error?.message}>{error?.message}</p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {field => (
              <div>
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map(error => (
                  <p key={error?.message}>{error?.message}</p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {state => (
            <Button
              type="submit"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? 'Submitting...' : 'Sign Up'}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div>
        <Button variant="link" onClick={onSwitchToSignIn}>
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  )
}
