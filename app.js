const contractAddress = "0x2c430De0f5a3fC01E9e0c28e0b3AC11Fc52Af71c";
const abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum RockScissorsPaper.Status",
        name: "currentStatus",
        type: "uint8",
      },
    ],
    name: "GamePlayer",
    type: "event",
  },
  {
    inputs: [],
    name: "gameRules",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_option",
        type: "uint8",
      },
    ],
    name: "playGame",
    outputs: [
      {
        internalType: "enum RockScissorsPaper.Status",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const provider = new ethers.providers.Web3Provider(window.ethereum, 97);

let signer;
let contract;

provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    signer = provider.getSigner(accounts[0]);
    contract = new ethers.Contract(contractAddress, abi, signer);
  });
});

async function playGame(choice) {
  if (document.getElementById("deposit").value < 0.0001) {
    document.getElementById("result").innerText =
      "Make deposit >= 0.0001 tBNB!";
    return;
  }

  document.getElementById("result").innerText = "Please wait ...";
  let amountInEth = document.getElementById("deposit").value;
  let amountInWei = ethers.utils.parseEther(amountInEth.toString());
  console.log(amountInWei);

  let resultOfPlayGame = await contract.playGame(choice, {
    value: amountInWei,
  });
  const res = await resultOfPlayGame.wait();
  console.log(res);

  let statusNum = await res.events[0].args.currentStatus;
  console.log(statusNum);
  let status;
  if (statusNum == 0) {
    status = "You win";
  } else if (statusNum == 1) {
    status = "You lose";
  } else {
    status = "Draw";
  }

  document.getElementById("result").innerText = status;
}
