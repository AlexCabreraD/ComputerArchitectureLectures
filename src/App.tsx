import '@/styles/tokens.css'
import '@/styles/global.css'

import { AppShell, ScrollArea } from '@/components/ui'
import VideoList from '@/components/VideoList'
import VideoEmbed from '@/components/VideoEmbed'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function App(): JSX.Element {
    useKeyboardNavigation()

    return (
        <ThemeProvider defaultTheme="dark">
            <AppShell>
                <AppShell.Sidebar>
                    <ScrollArea style={{ height: '100%' }}>
                        <VideoList />
                    </ScrollArea>
                </AppShell.Sidebar>

                <AppShell.Main>
                    <VideoEmbed />
                </AppShell.Main>
            </AppShell>
        </ThemeProvider>
    );
}