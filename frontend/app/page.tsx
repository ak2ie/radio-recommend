"use client"

import * as React from 'react';
import { Container, Box, Button, Stack, Typography, Stepper, Step, StepLabel } from "@mui/material";
import Link from "next/link";
import { useRouter } from 'next/router';
import { blue, deepOrange, deepPurple, green, pink, purple } from '@mui/material/colors';

export default function Page() {
  return (
    <Container sx={{ marginTop: "40px" }}>
      <Box>
        <Typography variant='h1' fontSize={30} color={pink[300]} fontWeight={800} align='center'>ラジオは聴きますか？</Typography>
        <Stack spacing={3}>
          <Button variant='outlined' color='primary' href="/frequencyListen">よく聴く</Button>
          <Button variant='outlined' color='secondary' href='/category'>あまり聴かない</Button>
        </Stack>
      </Box>
    </Container>
  )
}
