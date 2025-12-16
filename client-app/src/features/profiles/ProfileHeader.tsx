import {
  Grid,
  Segment,
  Item,
  Header,
  Statistic,
  Divider,
} from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import FollowButton from "./FollowButton";

interface Props {
  profile: Profile;
}

export default observer(function ProfileHeader({ profile }: Props) {
  return (
    <Segment>
      <Grid stackable>
        <Grid.Column width={12} mobile={16} tablet={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size="small"
                src={profile.image || "/assets/user.png"}
                style={{ marginRight: "1em" }}
              />
              <Item.Content verticalAlign="middle">
                <Header
                  as="h1"
                  content={profile.displayName}
                  style={{
                    fontSize: "clamp(1.5em, 4vw, 2em)",
                    marginBottom: "0.5em",
                  }}
                />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>

        <Grid.Column width={4} mobile={16} tablet={4}>
          <Statistic.Group
            widths={2}
            size="small"
            style={{ marginBottom: "1em" }}
          >
            <Statistic
              label="Followers"
              value={profile.followersCount}
              style={{ textAlign: "center" }}
            />
            <Statistic
              label="Following"
              value={profile.followingCount}
              style={{ textAlign: "center" }}
            />
          </Statistic.Group>
          <Divider fitted />
          <div style={{ textAlign: "center", marginTop: "1em" }}>
            <FollowButton profile={profile} />
          </div>
        </Grid.Column>
      </Grid>
    </Segment>
  );
});
