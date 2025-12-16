import { Button, Dropdown, Image, Menu } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
  const {
    userStore: { user, logout },
  } = useStore();
  return (
    <Menu inverted fixed="top" style={{ zIndex: 1000 }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          margin: "0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            overflowX: "scroll",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch", // Enable smooth iOS scrolling
            minWidth: 0, // Required for flex-grow to work properly
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
        >
          <Menu.Item
            as={NavLink}
            to="/"
            header
            style={{
              flexShrink: 0,
              paddingLeft: 0,

              border: "none",
            }}
          >
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: 10 }}
            />
            Eventure
          </Menu.Item>
          <div style={{ display: "flex", minWidth: "300px" }}>
            <Menu.Item
              as={NavLink}
              to="/activities"
              name="Activities"
              style={{ flexShrink: 0 }}
            />
            <Menu.Item style={{ flexShrink: 0, marginRight: 15 }}>
              <Button
                as={NavLink}
                to="/createActivity"
                positive
                content="Create Activity"
              />
            </Menu.Item>
          </div>
        </div>
        <Menu.Item position="right" style={{ flexShrink: 0, paddingRight: 3 }}>
          <Image
            src={user?.image || "/assets/user.png"}
            avatar
            spaced="right"
          />
          <Dropdown pointing="top right" text={user?.displayName}>
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to={`profiles/${user?.username}`}
                text="My Profile"
                icon="user"
              />
              <Dropdown.Item onClick={logout} text="Logout" icon="power" />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </div>
    </Menu>
  );
});
