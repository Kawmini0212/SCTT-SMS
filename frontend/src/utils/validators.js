export const validationRules = {
    firstName: {
        required: 'First name is required',
        minLength: { value: 2, message: 'Minimum 2 characters' },
        maxLength: { value: 100, message: 'Maximum 100 characters' }
    },
    lastName: {
        required: 'Last name is required',
        minLength: { value: 2, message: 'Minimum 2 characters' },
        maxLength: { value: 100, message: 'Maximum 100 characters' }
    },
    address: {
        required: 'Address is required'
    },
    birthday: {
        required: 'Birthday is required',
        validate: (value) => {
            const date = new Date(value);
            const now = new Date();
            return date < now || 'Birthday must be in the past';
        }
    },
    idNumber: {
        required: 'ID number is required',
        pattern: {
            value: /^[A-Z0-9]+$/,
            message: 'Only uppercase letters and numbers allowed'
        }
    },
    degreeProgramId: {
        required: 'Degree program is required'
    }
};

export const loginValidationRules = {
    username: {
        required: 'Username is required'
    },
    password: {
        required: 'Password is required'
    }
};
