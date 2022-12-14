import { Links } from "@/constants/Links";
import { useLocale } from "@/i18n/useLocale";
import { Button, Container, Group, Title } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

const NodataMessage = () => {
  const { t } = useLocale();
  const router = useRouter();
  const commonPath = Links.getCommonPath(router);
  return (
    <Container>
      <Title
        order={1}
        size="h1"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}` })}
        weight={900}
        align="center"
      >
        {t.Common.NodataMessage.Title}
      </Title>
      <Link href={commonPath + "/poll"}>
        <Group position="center" my="xl">
          <Button radius="md" variant="gradient" gradient={{ from: "blue", to: "grape" }}>
            {t.Button.StartFromHere}
          </Button>
        </Group>
      </Link>
    </Container>
  );
};

export default NodataMessage;
