import * as React from "react";
import styles from "./SpFxCurd.module.scss";
import { ISpFxCurdProps } from "./ISpFxCurdProps";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http"; //SPHttpClientConfiguration is declared but its value is never read.
//import * as moment from "moment";

//single item
interface IListItem {
  // 'IBookListItem'
  Title: string;
  Age: string;
  ID: number;
  Salary:number;
}
//multiple items
interface IAllItems {
  // 'IAllItems'
  AllCurds: IListItem[];
  listTitle: string;
  listAge: any; 
  listSalary:any;
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
      listSalary:"",
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
      if (response.ok) {
        return response.json();
      }
    })
    .then((i) => {
      if (i == undefined) {
      } else {
        this.setState({
          AllCurds: i.value,
        });
        console.log(this.state.AllCurds);
      }
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
     Salary:this.state.listSalary,
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
      Salary:this.state.listSalary,
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
          <input
            value={this.state.listSalary}
            type="number"
            name=""
            id="lsSalary"
            placeholder="Salary"
            onChange={(e) => {
              this.setState({
                listSalary: e.currentTarget.value as any,
              });
            }}
          />
          <br /><br />
         
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
            <th>Salary</th>
           {/*  <th>Description</th>
            <th>DOB</th>
            <th>Shift</th> */}
            <th></th>
            <th></th>
            {this.state.AllCurds.map((emp) => {
              return (
                <tr>
                  <td>{emp.Title}</td>
                  <td>{emp.Age}</td>
                  <td>{emp.Salary}</td>
                 {/*  <td>{emp.Description}</td>
                   <td>{moment(emp.DOB).format("LL")}</td>
                   <td>{emp.Shift}</td> */} 
                  <td>
                    <button
                      onClick={() => {
                        this.setState({
                          listTitle: emp.Title,
                          listAge: emp.Age,
                          listSalary: emp.Salary,
                          /* listDescription: emp.Description,
                          listDOB:moment(emp.DOB).format("LL"),
                           listShift: emp.Shift,   */
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
