import {getFirstName, isValidPassword} from "../src/utils/users";

test('Should return first name when given full name', () => {
    const firstName = getFirstName('Luis Troya');
    expect(firstName).toBe('Luis');
});

test('Should return first name when given first name', () => {
    const firstName = getFirstName('Luis');
    expect(firstName).toBe('Luis');
});

test('Should reject password shorter than 8 characters', () => {
    const isValid = isValidPassword('secret');
    expect(isValid).toBe(false);
});

test('Should reject password that contains word password', () => {
    const isValid = isValidPassword('password');
    expect(isValid).toBe(false);
});

test('Should correctly validate a valid password', () => {
    const isValid = isValidPassword('super_secret');
    expect(isValid).toBe(true);
});


