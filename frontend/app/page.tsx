"use client";

import * as React from "react";
import { Container, Box, Button, Stack, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { credential, initializeApp } from "firebase-admin";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { auth } from "@/firebase/client";

export default function Page() {
  signInWithEmailAndPassword(auth, "", "")
    .then((c) => c.user.getIdToken())
    .then((res) => {
      console.log(res);
    });
  return (
    <Container sx={{ marginTop: "40px" }}>
      <Box>
        <Typography
          variant="h1"
          fontSize={30}
          color={pink[300]}
          fontWeight={800}
          align="center"
        >
          ラジオは聴きますか？
        </Typography>
        <Stack spacing={3}>
          <Button variant="outlined" color="primary" href="/frequencyListen">
            よく聴く
          </Button>
          <Button variant="outlined" color="secondary" href="/category">
            あまり聴かない
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
