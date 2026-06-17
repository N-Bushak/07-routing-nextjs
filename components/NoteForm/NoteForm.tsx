import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import css from './NoteForm.module.css';
import { useId } from 'react';
import * as Yup from 'yup';
import { createNote, fetchCategories } from '@/lib/api';
import { type Category } from '@/types/note';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  tag: '',
};

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title too short')
    .max(50, 'Title too long')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content is too long'),
  tag: Yup.string().required('Category is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const fieldID = useId();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

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
          <label htmlFor={`${fieldID}-category`}>Category</label>
          <Field
            as="select"
            id={`${fieldID}-category`}
            name="tag"
            className={css.select}
          >
            <option value="">Select category</option>
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
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
