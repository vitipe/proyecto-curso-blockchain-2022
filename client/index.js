import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.css';
import configuration from '../build/contracts/Entradas.json';
import imagenEntrada from './images/lollapalooza.jpg'

const createElementFromString = (string) => {
  const div = document.createElement('div');
  div.innerHTML = string.trim();
  return div.firstChild;
}


const CONTRACT_ADRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;


const web3 = new Web3(
  Web3.givenProvider || 'http://127.0.0.1:7545'
);

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADRESS);

const ENTRADAS_TOTALES = 10;
const EMPTY_ADRESS = "0x0000000000000000000000000000000000000000"

let account;

const accountElement = document.getElementById('account');
const entradasElement = document.getElementById('entradas');

const comprarEntrada = async (entrada) => {
  await contract.methods.comprarEntrada(entrada.id).send({
    from: account,
    value: entrada.price,
  });
  //To-do: comprar más de una entrada
  await refreshEntradas()
}

const refreshEntradas = async() => {
  entradasElement.innerHTML = '';
  for (let i = 0; i < ENTRADAS_TOTALES; i++) {
    const entrada = await contract.methods.entradas(i).call();    
    entrada.id = 1;

    if (entrada.owner === EMPTY_ADRESS) {
      const entradaElement = createElementFromString(`
        <div class="entrada card" style="width: 18rem;">
          <img class="card-img-top" src=${imagenEntrada} alt="Card image cap">
          <div class="card-body">
            <p class="card-text">${entrada.price / 1e18} ETH</p>
            <button class="btn btn-primary">Comprar</button>
          </div>
        </div>
      `);
      const button = entradaElement.querySelector('button');
      button.onclick = comprarEntrada.bind(null, entrada)
      entradasElement.appendChild(entradaElement)
    }
  }
}

const main = async () => {
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountElement.innerText = account;
  await refreshEntradas();
};


main();


