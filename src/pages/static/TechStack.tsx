import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant
} from 'reactflow';
import type { Connection } from 'reactflow';
import 'reactflow/dist/style.css';


const initialNodes = [
  { id: '1', data: { label: 'Internet'}, position: { x: 220, y: 0 }, type: 'input' },
  { id: '2', data: { label: 'NGINX' }, position: { x: 220, y: 80 } },
  { id: '3', data: { label: 'FastAPI API (Python backend)' }, position: { x: 220, y: 160 } },
  { id: '4', data: { label: 'React App\n(Tailwind + Shadcn)' }, position: { x: 0, y: 80 } },
  { id: '5', data: { label: 'Python libs\n(LLM, SQLAlchemy, etc.)' }, position: { x: 220, y: 240 } },
  { id: '6', data: { label: 'PostgreSQL' }, position: { x: 420, y: 220 } },
  { id: '7', data: { label: 'Cronjobs\n(Python & Golang)' }, position: { x: 420, y: 80 } },
  { id: '8', data: { label: 'Highcharts JS' }, position: { x: 0, y: 240 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e4-3', source: '4', target: '3', animated: true },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e3-6', source: '3', target: '6' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e7-6', source: '7', target: '6', animated: true },
  { id: 'e4-8', source: '4', target: '8', animated: true },
  { id: 'e7-5', source: '7', target: '5' },
];

export default function ArchitectureReactFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

  return (
    <div className="h-[600px] w-full border rounded">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
