export default interface Command {
  name: string;
  description: string;
  usage: string;
  execute?: Function;
  button?: Function;
  modal?: Function;
  selectMenu?: Function;
}
