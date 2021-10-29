import {StrengthPipe} from './strength.pipe';
describe('StrengthPipe',()=>{
    it('should display weak if strength is 5',()=>{
        // arrange
        let pipe = new StrengthPipe();

        // act
        let strength = pipe.transform(5);
        //assert
        expect(strength).toEqual('5 (weak)');
    });
})
