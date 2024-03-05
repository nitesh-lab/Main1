// Import statements...
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {  Signup } from '../services/userData';

export type Data = {
  Name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhoto: FileList;
};

function SignupComponent() {
  const nav = useNavigate();
  const { mutate: createUser, isIdle } = useMutation({
    mutationFn: (data: Data) => Signup(data),  //replace with function
    onSuccess: () => {
      reset();
      nav('/login');
    },
  });

  const { register, handleSubmit, formState, reset } = useForm<Data>();
  const { errors } = formState;

  function onSubmit(data:Data):void{
    // Use the first item in the FileList

    createUser(data);
   
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="w-full max-w-md p-6  rounded-md shadow-md bg-black">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="Name" className="block text-white text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="Name"
              className={`input-field ${errors.Name ? 'input-error' : ''}`}
              {...register('Name', { required: 'Name is required' })}
            />
            {errors.Name && <p className="error-message">{errors.Name.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-white text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`input-field ${errors.password ? 'input-error' : ''}`}
              {...register('password', { required: 'Password is required', minLength: 8 })}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-white text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
              {...register('confirmPassword', { required: 'Confirm Password is required', minLength: 8 })}
            />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="profilePhoto" className="block text-white text-sm font-bold mb-2">
              Profile Photo
            </label>
            <input
              type="file"
              id="profilePhoto"
              className={`input-field ${errors.profilePhoto ? 'input-error' : ''}`}
              accept="image/*"
              {...register('profilePhoto', { required: 'Profile photo is required' })}
            />
            {errors.profilePhoto && <p className="error-message">{errors.profilePhoto.message}</p>}
          </div>

          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isIdle ? 'Sign Up' : 'Signing Up...'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupComponent;
