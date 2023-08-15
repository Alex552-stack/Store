import * as yup from 'yup'

export const validationSchema = yup.object({
    name: yup.string().required(),
    brand: yup.string().required(),
    type: yup.string().required(),
    price: yup.number().required().moreThan(100),
    quantityInStock: yup.number().required().min(1),
    description: yup.string().required(),
    file: yup.mixed().test('file-required', 'File is required when pictureUrl is not present', function (value) {
        const pictureUrl = this.parent.pictureUrl; // Access pictureUrl from parent
        if (!pictureUrl && !value) {
            throw new yup.ValidationError('File is required', value, 'file');
        }
        return true;
    }).notRequired()
})