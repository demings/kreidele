import { GetServerSideProps } from "next";
import Whiteboard from "../../src";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: { id: context.query.id } };
};

export default function Room({ id }: { id: string }) {
  return (
    <>
      <Whiteboard roomId={id} />
    </>
  );
}
