import { observer } from "mobx-react-lite";
import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityFilters() {
  const { activityStore } = useStore();
  const { predicate, setPredicate } = activityStore;
  return (
    <>
      <Menu
        vertical
        size="large"
        style={{
          width: "100%",
          marginTop: 25,
          minWidth: "200px",
          fontSize: "clamp(14px, 2.5vw, 16px)",
        }}
      >
        <Header
          icon="filter"
          attached
          color="teal"
          content="Filters"
          style={{ fontSize: "clamp(16px, 3vw, 18px)" }}
        />
        <Menu.Item
          content="All Activities"
          active={predicate.has("all")}
          onClick={() => setPredicate("all", "true")}
          style={{ padding: "clamp(8px, 2vw, 12px)" }}
        />
        <Menu.Item
          content="I'm going"
          active={predicate.has("isGoing")}
          onClick={() => setPredicate("isGoing", "true")}
          style={{ padding: "clamp(8px, 2vw, 12px)" }}
        />
        <Menu.Item
          content="I'm hosting"
          active={predicate.has("isHost")}
          onClick={() => setPredicate("isHost", "true")}
          style={{ padding: "clamp(8px, 2vw, 12px)" }}
        />
      </Menu>
      <Header />
      <div className="responsive-calendar-container">
        <Calendar
          onChange={(date) => setPredicate("startDate", date as Date)}
          value={predicate.get("startDate") || new Date()}
        />
      </div>
    </>
  );
});
