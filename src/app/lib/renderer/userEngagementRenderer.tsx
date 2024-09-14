export const userEngagementRenderer = ({
  totalFollowers,
}: {
  totalFollowers: number;
}) => {
  return <div style={{ display: "flex" }}>{totalFollowers}</div>;
};
