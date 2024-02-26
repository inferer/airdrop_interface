const contractList = 
// {
//   "USDTtoken": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
//   "USDCtoken": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
//   "Daitoken": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
//   "WETH": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
//   "AirUSDTtoken": "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
//   "AirUSDCtoken": "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
//   "AirDaitoken": "0x0165878A594ca255338adfa4d48449f69242Eb8F",
//   "AirETHtoken": "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
//   "Alg-Social": "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
//   "Alg-Sports": "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
//   "Alg-Game": "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
//   "Alg-Art": "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
//   "Alg-Finance": "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
//   "Alg-Commerce": "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
//   "Air-Social": "0x9A676e781A523b5d0C0e43731313A708CB607508",
//   "Air-Sports": "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
//   "Air-Game": "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
//   "Air-Art": "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
//   "Air-Finance": "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
//   "Air-Commerce": "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c",
//   "infererProxyAdmin": "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d",
//   "airdropAssetTreasuryLogic": "0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026",
//   "airdropAssetTreasury": "0xF85895D097B2C25946BB95C4d11E2F3c035F8f0C",
//   "factory": "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
//   "router02": "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
//   "airdropTokenScoreLogic": "0xc5a5C42992dECbae36851359345FE25997F5C42d",
//   "airdropTokenScore": "0xc0F115A19107322cFBf1cDBC7ea011C19EbDB4F8",
//   "airdropManagerLogic": "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB",
//   "airdropManager": "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9",
//   "airdropSenderLogic": "0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8",
//   "airdropSender": "0xf5059a5D33d5853360D16C683c16e67980206f36",
//   "airdropReceriverLogic": "0x70e0bA845a1A0F2DA3359C97E0285013525FFC49",
//   "airdropReceriver": "0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf",
//   "multicall": "0x1291Be112d480055DaFd8a610b7d1e203891C274"
// }

{
  "USDTtoken":"0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A",
  "USDCtoken":"0x07882Ae1ecB7429a84f1D53048d35c4bB2056877",
  "Daitoken":"0x22753E4264FDDc6181dc7cce468904A80a363E44",
  "WETH":"0xA7c59f010700930003b33aB25a7a0679C860f29c",
  "AirUSDTtoken":"0xfaAddC93baf78e89DCf37bA67943E1bE8F37Bb8c",
  "AirUSDCtoken":"0x276C216D241856199A83bf27b2286659e5b877D3",
  "AirDaitoken":"0x3347B4d90ebe72BeFb30444C9966B2B990aE9FcB",
  "AirETHtoken":"0x3155755b79aA083bd953911C92705B7aA82a18F9",
  "alg-Social":"0x5bf5b11053e734690269C6B9D438F8C9d48F528A",
  "alg-Sports":"0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429",
  "alg-Game":"0x3aAde2dCD2Df6a8cAc689EE797591b2913658659",
  "alg-Art":"0xab16A69A5a8c12C732e0DEFF4BE56A70bb64c926",
  "alg-Finance":"0xE3011A37A904aB90C8881a99BD1F6E21401f1522",
  "alg-Commerce":"0x1f10F3Ba7ACB61b2F50B9d6DdCf91a6f787C0E82",
  "air-Social":"0x457cCf29090fe5A24c19c1bc95F492168C0EaFdb",
  "air-Sports":"0x525C7063E7C20997BaaE9bDa922159152D0e8417",
  "air-Game":"0x38a024C0b412B9d1db8BC398140D00F5Af3093D4",
  "air-Art":"0x5fc748f1FEb28d7b76fa1c6B07D8ba2d5535177c",
  "air-Finance":"0xB82008565FdC7e44609fA118A4a681E92581e680",
  "air-Commerce":"0x2a810409872AfC346F9B5b26571Fd6eC42EA4849",
  "airdropAssetTreasury":"0xb9bEECD1A582768711dE1EE7B0A1d582D9d72a6C",
  "factory":"0x8A93d247134d91e0de6f96547cB0204e5BE8e5D8",
  "router02":"0xF32D39ff9f6Aa7a7A64d7a4F00a54826Ef791a55",
  "airdropTokenScore":"0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f",
  "airdropUserPool":"0xCA8c8688914e0F7096c920146cd0Ad85cD7Ae8b9",
  "airdropManager":"0x5FeaeBfB4439F3516c74939A9D04e95AFE82C4ae",
  "airdropSender":"0x976fcd02f7C4773dd89C309fBF55D5923B4c98a1",
  "airdropReceriver":"0xfcDB4564c18A9134002b9771816092C9693622e3",
  "multicall":"0x5302E909d1e93e30F05B5D6Eea766363D14F9892"
}

export const othersContracts = {
  "projectContract": "0xb007167714e2940013EC3bb551584130B7497E22",
  "infererTrackManagerLogic": "0x6b39b761b1b64C8C095BF0e3Bb0c6a74705b4788",
  "infererTrackManager": "0x74Df809b1dfC099E8cdBc98f6a8D1F5c2C3f66f8",
}

export default contractList