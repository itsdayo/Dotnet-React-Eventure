import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import { useStore } from "../../app/stores/store";
import ProfileActivities from "./ProfileActivities";

interface Props {
  profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props) {
  const { profileStore } = useStore();
  const panes = [
    { menuItem: "About", render: () => <ProfileAbout /> },
    { menuItem: "Photos", render: () => <ProfilePhotos profile={profile} /> },
    { menuItem: "Events", render: () => <ProfileActivities /> },
    {
      menuItem: "Followers",
      render: () => <ProfileFollowings />,
    },
    {
      menuItem: "Following",
      render: () => <ProfileFollowings />,
    },
  ];
  return (
    <div style={{ width: "100%", overflow: "hidden", boxSizing: "border-box" }}>
      <Tab
        menu={{
          fluid: true,
          vertical: window.innerWidth > 768, // Vertical on desktop, horizontal on mobile
          attached: false,
          style: {
            width:
              window.innerWidth > 768 ? "clamp(120px, 25vw, 200px)" : "100%",
            minWidth: window.innerWidth > 768 ? "120px" : "auto",
            flexDirection: window.innerWidth > 768 ? "column" : "row",
            justifyContent:
              window.innerWidth > 768 ? "flex-start" : "flex-start",
            boxSizing: "border-box",
            overflowX: window.innerWidth > 768 ? "visible" : "auto",
            whiteSpace: window.innerWidth > 768 ? "normal" : "nowrap",
            scrollbarWidth: "thin", // Firefox
            msOverflowStyle: "none", // IE/Edge
          },
        }}
        menuPosition="right"
        panes={panes}
        onTabChange={(_, data) =>
          profileStore.setActiveTab(data.activeIndex as number)
        }
        style={{
          minHeight: "400px",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: window.innerWidth > 768 ? "row" : "column",
        }}
      />
      {/* Hide scrollbar for WebKit browsers */}
      <style>
        {`
          @media (max-width: 768px) {
            .ui.menu.fluid.vertical:not(.tabular):not(.text) {
              overflow-x: auto !important;
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            .ui.menu.fluid.vertical:not(.tabular):not(.text)::-webkit-scrollbar {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
});
