import * as React from "react";
import styles from "./SpFxCurd.module.scss";
import { ISpFxCurdProps } from "./ISpFxCurdProps";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http"; //SPHttpClientConfiguration is declared but its value is never read.
import * as moment from "moment";

//single item
interface IListItem {
  // 'IBookListItem'
  Title: string;
  Age: string;
  ID: number;
  Description: string;
  DOB: any;
  Salary: any;
  Shift: any;
}
//multiple items
interface IAllItems {
  // 'IAllItems'
  AllCurds: IListItem[];
  listTitle: string;
  listAge: any;
  listDescription: any;
   listDOB: any,
  listSalary: any;
  listShift: any; 
  listSelectedID: number;
}
export default class CurdList extends React.Component<
  ISpFxCurdProps,
  IAllItems
> {
  constructor(props: ISpFxCurdProps, state: IAllItems) {
    super(props);
    this.state = {
      AllCurds: [],
      listTitle: undefined,
      listAge: 0,
      listDescription: undefined,
      listDOB: null,
      listSalary: 0,
      listShift: undefined,
      listSelectedID: 0, 
    };
  }

  componentDidMount() {
    //alert ("Componenet Did Mount Called...");
    //console.log("First Call.....");
    this.getAllCurdDetails();
  }

  public getAllCurdDetails = () => {
    console.log("This is Curd Detail function");
    //api call

    let listurl = `${this.props.siteUrl}/_api/lists/GetByTitle('${this.props.listName}')/items`;
    console.log(listurl);

    this.props.context.spHttpClient
      .get(listurl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON: any) => {
          //console.log(responseJSON);
          this.setState({ AllCurds: responseJSON.value });
        });
        console.log(this.state.AllCurds);
      });
  };
  // Delete item
  public deleteItem = (itemID: number) => {
    // alert("this is delete");
    //let listName = `Curd`;

    let listurl = `${this.props.siteUrl}/_api/lists/GetByTitle('${this.props.listName}')/items(${itemID})`;

    this.props.context.spHttpClient
      .post(listurl, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=verbose",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "DELETE",
        },
      })
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          alert(`Item ID: ${itemID} deleted successfully!`);
          this.getAllCurdDetails();
        } else {
          alert(`Something went wrong!`);
          console.log(response.json());
        }
      });
  };
  // Add item
  public addItemInList = () => {
    // alert("this is delete");
    let listName = `Curd`;

    let listurl = `${this.props.siteUrl}/_api/web/lists/getbytitle('${listName}')/items`;

    const body: string = JSON.stringify({
      Title: this.state.listTitle,
      Age: this.state.listAge,
      Description: this.state.listDescription,
      DOB: this.state.listDOB,
      Salary: this.state.listSalary,
      Shift: this.state.listShift, 
      SelectedID: this.state.listSelectedID,
    });

    this.props.context.spHttpClient
      .post(listurl, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=nometadata",
          "odata-version": "",
        },
        body: body,
      })
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          alert(`Item added successfully!`);
          this.getAllCurdDetails();
        } else {
          alert(`Something went wrong!`);
          console.log(response.json());
        }
      });
  };

  // Update item
  public updateItemInList = (itemID: number) => {
    // alert("this is delete");
    let listName = `Curd`;

    let listurl = `${this.props.siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemID})`;

    const body: string = JSON.stringify({
      Title: this.state.listTitle,
      Age: this.state.listAge,
      Description: this.state.listDescription,
      DOB: this.state.listDOB,
      Salary: this.state.listSalary,
      Shift: this.state.listShift, 
      SelectedID: this.state.listSelectedID,
    });

    this.props.context.spHttpClient
      .post(listurl, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=nometadata",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
        },
        body: body,
      })
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          alert(`Item updated successfully!`);
          this.getAllCurdDetails();
        } else {
          alert(`Something went wrong!`);
          console.log(response.json());
        }
      });
  };
  public render(): React.ReactElement<ISpFxCurdProps> {
    return (
      <>
        <div
          style={{
            backgroundColor: "#fcc5b1",
            padding: "5px",
            textIndent: "10px",
          }}
        >
          {" "}
          <b> Employee List</b> (Using SPFx Curd Operation)
        </div>
        <br />
        <div className={styles.space}>
          <b>Name:</b>{" "}
          <input
            value={this.state.listTitle}
            type="text"
            name=""
            id="lsTitle"
            placeholder="Name"
            onChange={(e) => {
              this.setState({
                listTitle: e.currentTarget.value,
              });
              // console.log(this.state.listTitle);
            }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
        
          <b>Age:</b>{" "}
          <input
            value={this.state.listAge}
            type="number"
            name=""
            id="lsAge"
            placeholder="Age"
            onChange={(e) => {
              this.setState({
                listAge: e.currentTarget.value as any,
              });
            }}
          />
          <br /><br />
          <b >Description:</b>{" "}
          <input
            value={this.state.listDescription}
            type="text"
            name=""
            id="lsDescription"
            placeholder="Description"
            onChange={(e) => {
              this.setState({
                listDescription: e.currentTarget.value as any,
                
              });
              
            }}
            style={{height:"40px",width:"200px"}} 
          />
          &nbsp;<br /><br />
          {/* <b>DOB:</b>{" "}
          <input
            value={this.state.listDOB}
            type="any"
            name=""
            id="lsDOB"
            placeholder="DOB"
            onChange={(e) => {
              this.setState({
                listDOB: e.currentTarget.value as any,
              });
            }}
          /> */}
          <button
            onClick={() => {
              this.addItemInList();
            }}
          >
            Submit
          </button>
          <button
            onClick={() => {
              this.updateItemInList(this.state.listSelectedID);
            }}
          >
            Update
          </button>
        </div>
        <hr />
        <div className={styles.box}>
          <table>
            <th>Title</th>
            <th>Age</th>
            <th>Description</th>
            <th>DOB</th>
            <th>Salary</th>
            <th>Shift</th>
            <th></th>
            <th></th>
            {this.state.AllCurds.map((emp) => {
              return (
                <tr>
                  <td>{emp.Title}</td>
                  <td>{emp.Age}</td>
                  <td>{emp.Description}</td>
                   <td>{moment(emp.DOB).format("LL")}</td>
                  <td>{emp.Salary}</td>
                   <td>{emp.Shift}</td> 
                  <td>
                    <button
                      onClick={() => {
                        this.setState({
                          listTitle: emp.Title,
                          listAge: emp.Age,
                          listDescription: emp.Description,
                          listDOB:moment(emp.DOB).format("LL"),
                          listSalary: emp.Salary,
                           listShift: emp.Shift,  
                          listSelectedID: emp.ID,
                        });
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        this.deleteItem(emp.ID);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </>
    );
  }
}
