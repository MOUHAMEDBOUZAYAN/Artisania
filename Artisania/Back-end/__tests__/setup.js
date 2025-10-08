
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/artisania-test';


jest.setTimeout(10000);


afterEach(() => {

});
