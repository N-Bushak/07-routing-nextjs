import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import css from './NoteForm.module.css';
import { useId } from 'react';
import * as Yup from 'yup';
import { createNote } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NoteFormProps {
  onClose: () => void;
}

interface NewNote {
  title: string;
  content: string;
  tag: string;
}

const initialValues: NewNote = {
  title: '',
  content: '',
  tag: 'todo', 
};

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title too short')
    .max(50, 'Title too long')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content is too long')
    .required('Content is required'), 
  tag: Yup.string().required('Tag is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const fieldID = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: NewNote) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
    onError: (error: Error) => {
      alert(`Failed to create note: ${error.message}`);
    },
  });

  const handleSubmit = (values: NewNote, actions: FormikHelpers<NewNote>) => {
    mutation.mutate(values, {
      onSuccess: () => actions.resetForm(),
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldID}-title`}>Title</label>
          <Field
            id={`${fieldID}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldID}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldID}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldID}-tag`}>Tag</label>
          <Field
            as="select" 
            id={`${fieldID}-tag`}
            name="tag"
            className={css.input}
          >
            <option value="todo">Todo</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="meeting">Meeting</option>
            <option value="shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
}