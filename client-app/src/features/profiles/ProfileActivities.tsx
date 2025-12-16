import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Tab, Grid, Header, Card, Image, TabProps } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { UserActivity } from "../../app/models/profile";
import { format } from "date-fns";
import { useStore } from "../../app/stores/store";
const panes = [
  { menuItem: "Future Events", pane: { key: "future" } },
  { menuItem: "Past Events", pane: { key: "past" } },
  { menuItem: "Hosting", pane: { key: "hosting" } },
];

export default observer(function ProfileActivities() {
  const { profileStore } = useStore();
  const { loadUserActivities, profile, loadingActivities, userActivities } =
    profileStore;
  useEffect(() => {
    loadUserActivities(profile!.username);
  }, [loadUserActivities, profile]);
  const handleTabChange = (data: TabProps) => {
    loadUserActivities(
      profile!.username,
      panes[data.activeIndex as number].pane.key
    );
  };
  return (
    <Tab.Pane loading={loadingActivities}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="calendar"
            content={"Activities"}
            style={{
              fontSize: "clamp(1.2em, 3vw, 1.5em)",
              marginBottom: "1em",
            }}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{
              secondary: true,
              pointing: true,
            }}
            onTabChange={(_, data) => handleTabChange(data)}
          />
          <br />
          <Card.Group
            itemsPerRow={
              window.innerWidth > 768 ? 4 : window.innerWidth > 480 ? 2 : 1
            }
            style={{
              marginTop: "1em",
            }}
          >
            {userActivities.map((activity: UserActivity) => (
              <Card
                as={Link}
                to={`/activities/${activity.id}`}
                key={activity.id}
                style={{
                  minHeight: window.innerWidth > 768 ? "auto" : "200px",
                }}
              >
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  style={{
                    minHeight: window.innerWidth > 768 ? 100 : 150,
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                <Card.Content>
                  <Card.Header
                    textAlign="center"
                    style={{
                      fontSize: "clamp(14px, 3vw, 16px)",
                      lineHeight: "1.2",
                      marginBottom: "0.5em",
                    }}
                  >
                    {activity.title}
                  </Card.Header>

                  <Card.Meta textAlign="center">
                    <div
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 14px)",
                        lineHeight: "1.3",
                      }}
                    >
                      {format(new Date(activity.date), "do LLL")}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 14px)",
                        lineHeight: "1.3",
                      }}
                    >
                      {format(new Date(activity.date), "h:mm a")}
                    </div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
