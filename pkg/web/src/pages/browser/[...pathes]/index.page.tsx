import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { Fetching } from '@violet/web/src/components/organisms/Fetching'
import styled from 'styled-components'
import { EmptyWork } from './components/EmptyWork'
import { Explorer } from './components/Explorer'
import { LeftColumn } from './components/LeftColumn'
import { ProjectBar } from './components/ProjectBar'
import { Revision } from './components/Revision'
import { StreamBar } from './components/StreamBar'
import { TabBar } from './components/TabBar'
import { usePage } from './usePage'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
`
const WorksView = styled.div`
  width: 100%;
  overflow-y: scroll;
`

const MainColumn = styled.div`
  display: flex;
  height: 100vh;
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: right;
  height: 100vh;
`

const RevisionContent = styled.div`
  min-width: 100%;
`

const StreamBarColumn = styled.div`
  height: 100vh;
`

const ProjectPage = () => {
  const { error, projectApiData, projects, currentProject } = usePage()

  if (!projectApiData || !currentProject) return <Fetching error={error} />
  console.log('Is the message ID updated?->', projectApiData.messages)
  return (
    <Container>
      <ProjectBar projects={projects} projectId={projectApiData.projectId} />
      <LeftColumn>
        <Explorer projectApiData={projectApiData} project={currentProject} />
      </LeftColumn>
      <WorksView>
        {projectApiData.revisions?.map((revision, i) =>
          currentProject.openedTabId ? (
            projectApiData.revisions?.length ? (
              <>
                <TabBar project={currentProject} projectApiData={projectApiData} />
                <MainColumn key={i}>
                  <MainContent>
                    <RevisionContent>
                      <Revision
                        projectId={currentProject.id}
                        workId={currentProject.openedTabId}
                        revision={revision}
                      />
                    </RevisionContent>
                    <Spacer axis="y" size={8} />
                  </MainContent>
                  <StreamBarColumn>
                    <StreamBar
                      projectId={currentProject.id}
                      workId={currentProject.openedTabId}
                      revision={revision}
                      messages={projectApiData.messages}
                    />
                  </StreamBarColumn>
                </MainColumn>
              </>
            ) : (
              <>
                <TabBar project={currentProject} projectApiData={projectApiData} />
                <EmptyWork projectId={currentProject.id} workId={currentProject.openedTabId} />
              </>
            )
          ) : (
            <div>Choose work</div>
          )
        )}
      </WorksView>
    </Container>
  )
}

export default ProjectPage
