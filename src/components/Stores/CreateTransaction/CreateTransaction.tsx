import React from "react";
import { Store } from "../../../models/storeModel";
import Autocomplete from "react-autocomplete";
import { transactionRequests } from "../../../functions/requests";
import { useSelector } from "react-redux";
import { State } from "../../../models/stateModel";
import NotificationProvider from "../../../functions/notificationProvider";

export default function CreateTransaction(props: { store: Store }) {
  const [locationText, setLocationText] = React.useState<string>();
  const [locations, setLocation] = React.useState<any>();

  const [method, setMethod] = React.useState<string>();

  const [itemName, setItemName] = React.useState<string>();
  const [itemPrice, setItemPrice] = React.useState<string>();

  const { token } = useSelector((state: State) => state);

  const { store } = props;

  React.useEffect(() => {
    let prevLocations: any[] = [];
    props.store.locations.forEach((location) => {
      prevLocations?.push({ label: location });
    });
    setLocation(prevLocations);

    return () => {};
  }, []);

  const onSubmit = async () => {
    const resData = await transactionRequests.createTransaction(
      token,
      itemPrice,
      method,
      locationText,
      store.name,
      itemName
    );
    setItemPrice("");
    setItemName("");
    setMethod("");
    setLocationText("");
    if (resData.error) {
      return NotificationProvider("Error", resData.message, "danger");
    }
    NotificationProvider("Success", resData.message, "success");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="create-transaction"
    >
      <h1 className="title">Create Transaction</h1>
      <input
        className="form-control"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => {
          setItemName(e.target.value);
        }}
        required
      />
      <input
        className="form-control"
        placeholder="Item Price"
        value={itemPrice}
        onChange={(e) => {
          setItemPrice(e.target.value);
        }}
        required
      />
      <Autocomplete
        getItemValue={(item) => item.label}
        items={locations}
        renderItem={(item, isHighlighted) => (
          <div style={{ background: isHighlighted ? "lightgray" : "white" }}>
            {item.label}
          </div>
        )}
        value={locationText}
        onChange={(e) => setLocationText(e.target.value)}
        onSelect={(val) => setLocationText(val)}
        inputProps={{ placeholder: "Location", required: true }}
      />
      <Autocomplete
        getItemValue={(item) => item.label}
        items={[{ label: "CARD" }, { label: "CASH" }]}
        renderItem={(item, isHighlighted) => (
          <div style={{ background: isHighlighted ? "lightgray" : "white" }}>
            {item.label}
          </div>
        )}
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        onSelect={(val) => setMethod(val)}
        inputProps={{ placeholder: "Method", required: true }}
      />
      <button
        className="btn"
        style={{ margin: "auto", display: "block", width: "100%" }}
      >
        Submit
      </button>
    </form>
  );
}
