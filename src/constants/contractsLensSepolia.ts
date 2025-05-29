const contractList = 
{
  "USDTtoken": "0x7A2a9004F90e80031e61c016aF3f19c6c05ab004",
  "USDCtoken": "0xE9a63c92362dF6D6663fD180d3ad3806696b7f12",
  "Daitoken": "0x6dBCB2f15BBa78931F838a0d3C0d0d65Fdc0C5C1",
  "WETH": "0x087b0AA25eE7F9C1f36E0BD0F7dE479f60b41D1C",
  "AirUSDTtoken": "0xC3a95e420b8f7a48A2A5154d9E8ED02c90AAe306",
  "AirUSDCtoken": "0x0900eeC7D725EE80989aba53A181862Ec484182f",
  "AirDaitoken": "0x78D9FFb1a8BC188291d917B3104aDe7A7F3EADeF",
  "AirETHtoken": "0x17f162B55b9d4F20e79bd4D3A4416f1Bca80Fd67",
  "Alg-Social": "0x775DFA2Be40060b5B5bFad008511a0Ec627746De",
  "Alg-Sports": "0x04721EF29096F92B061F376a0D7833425C57f524",
  "Alg-Game": "0x385c269EFBF0556da58e0D13587F62D9F995754f",
  "Alg-Art": "0x331679DD4426b461E8E36554F47F0E3070624bBC",
  "Alg-Finance": "0xde1235dCe8f11Cb703c8dbE3BE6B691ccF8f7c5c",
  "Alg-Commerce": "0x9B36FfBF750ffA7851Ad50d474aa2fC630cF32fd",
  "Air-Social": "0x45C9BCEBDfF1aab63b39Fa6Cf20231F829402f08",
  "Air-Sports": "0xb00dE2bC958F1A4D2E6AbB57f3711f13195bcA2D",
  "Air-Game": "0xdA6EA4D91afEa7f5ad1cfcC4250194a04669F533",
  "Air-Art": "0x30dCc6B7b5E98046c588978f3fDB0de73DcFB583",
  "Air-Finance": "0x4B8e7Eb486a2EdFBa1284928a73a0374401A232C",
  "Air-Commerce": "0xcb8e2bAE7e7EBd665DDa81a3E50BC37244677C8A",
  "infererProxyAdmin": "0xE5Ea50dECf2F75b6860925c3D4E8A783d57187e5",
  "airdropAssetTreasuryLogic": "0x31e72639772E4A3E2d6ca6133E2781c44C6aA44E",
  "airdropAssetTreasury": "0x7CF3FBC19Da7193d786f8eBDf5d59A8A6cE8767B",
  "factory": "0x38B16F4d62DFC0B2aa6FF767262957cE61A49dfa",
  "router02": "0x936fb12B9735D908475e71cD4EEeb5f373C6C63f",
  "airdropTokenScoreLogic": "0x23a9D207b0bA7117E2504BE777a56e8825F14E50",
  "airdropTokenScore": "0xb1050D43A9646d618293802F2545dc91c6163b90",
  "airdropManagerLogic": "0x729eF5DeC48ef100cd009CBF136F9e5A44f77aEC",
  "airdropManager": "0x61544BC0b4124052e2557129B77AB9dA72F061c4",
  "airdropUserTaskLogic": "0xA35CE4f84b5337c6F2a3D51F9Da3622b1CBB4423",
  "airdropUserTask": "0x13B8905BfE85e6A76776dBC489a62FCcd97169aD",
  "airdropSenderReferLogic": "0x798C9e661aB105084cCF436E06F69EaBE2484370",
  "airdropSenderRefer": "0xb49B8869fB7711da1CbbaFf7bAB87E1d3C7500Db",
  "referManagerLogic": "0xE6F616235474ae5bad5D523f42cfF9113DD19ABC",
  "referManager": "0x348D387dbAd0441eaC44BE950ABEA209b2923f45",
  "airdropNFT721": "0xC0ABF1F49aeC21A02f97c7074fbaef9D9C030056",
  "airdropReceiverLogic": "0x1f9e216a9aeBd3371763a91722Ba5E0817A79024",
  "airdropReceiver": "0x24568c8E75d2349af953bcfaa98512A658b3c1c7",
  "multicall": "0xeDb4832C870341309A14C5163d942B164cE33cb3"
}

export const othersContracts = {
  "projectContract": "0x0d900E5bb647dedBd848c6C217c17576C53D7913",
  "infererTrackManagerLogic": "0x33240A3a001577B19de1Fa55bA089f41FD2E5948",
  "infererTrackManager": "0x7B9fA9998E45B51f48F2611B45fA728e7ce87F9b",
}

export const campaignContracts = 
{
  "Alg-Campaign": "0x8B10D879751DF32398D909bbc127247F72ee157F",
  "Air-Campaign": "0xB3660Ee131De0971668baD643059dD82A335DA50",
  "campaignManagerLogic": "0xCe763807119141AE2Bc1ED36CCB4Db0e39e1c52a",
  "campaignManager": "0x2464F89F67f81a11181543bC79ae6B5F2fa351Dc",
  "campaignSenderLogic": "0x105D28E89c3Cb4eBDB257A5059e1ea96108167F3",
  "campaignSender": "0x3E33C4BdBf958e5ED84765615a1D33df6ba1AfA9",
  "campaignApplyLogic": "0x54653963F4c64f8eBc494b5BB036454a72CE4b1C",
  "campaignApply": "0x4Bbb85B188341d9F5D0Cca2e6955920ba6E50735"
}

export const airdropReferContracts = {
  "airdropNFT721": contractList.airdropNFT721,
  "referManagerLogic": contractList.referManagerLogic,
  "referManager": contractList.referManager,
  "airdropSenderReferLogic": contractList.airdropSenderReferLogic,
  "airdropSenderRefer": contractList.airdropSenderRefer
}

export default contractList

  