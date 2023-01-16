import fs from 'fs';
import read from 'readline';

const command = read.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class Bot {


    Initialize(callback: Function){

        function reloadThis(){

            const verifyIfBotNameExists = fs.existsSync('botname.txt');

            if ( !verifyIfBotNameExists ){

                command.question('🤖: Pronto ! tudo certo.\nPara começarmos, por favor, me dê um nome ! esse nome será utilizado por mim no Whatsapp. \nQual será meu nome? \n\n', bot => {

                    fs.writeFile('botname.txt', bot , async function(error){

                        if(error){

                            console.log('🤖: Algum erro ocorreu durante a minha nomeação. \n Vamos tentar novamente \n');

                            return;

                        }

                        console.log(`🤖: Então eu me chamo ${bot} ! Fantástico ! \n`);

                        return reloadThis();

                    });

                });

            }

            callback();

        }

        reloadThis();

    }

}

export default new Bot();
