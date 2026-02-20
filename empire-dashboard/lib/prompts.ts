// Terminal Prompt Generator
// Generates ready-to-use Claude prompts for task execution

import type { AgentType } from './types';

interface PromptParams {
  agent: AgentType;
  subject: string;
  description: string;
  protocol?: string;
  context?: {
    projectName?: string;
    featureName?: string;
    prdPath?: string;
    architecturePath?: string;
    designPath?: string;
  };
}

// Agent-specific prompt templates
const AGENT_PROMPTS: Record<AgentType, (params: PromptParams) => string> = {
  PM: (params) => {
    const protocol = params.protocol ? `Siga o protocolo em vibe-coding/PROTOCOLOS/${params.protocol}` : '';
    return `# Task: ${params.subject}

## Description
${params.description}

## Agent: PM (Project Manager)
${protocol}

## Instructions
1. Analyze the requirements and create/update necessary documentation
2. Coordinate with other agents as needed
3. Update docs/ROADMAP.md with progress
4. Document any decisions in docs/DECISOES.md

## Context
${params.context?.projectName ? `Project: ${params.context.projectName}` : ''}
${params.context?.featureName ? `Feature: ${params.context.featureName}` : ''}
${params.context?.prdPath ? `PRD: ${params.context.prdPath}` : ''}

---
Execute this task following Empire Vibe Coding protocols.`;
  },

  ARCHITECT: (params) => {
    const protocol = params.protocol ? `Siga o protocolo em vibe-coding/PROTOCOLOS/${params.protocol}` : '';
    return `# Task: ${params.subject}

## Description
${params.description}

## Agent: ARCHITECT
${protocol}

## Instructions
1. Define the technical architecture for this task
2. Document in docs/ARQUITETURA/ directory
3. Consider:
   - Database schema changes
   - API structure
   - State management
   - Security implications
4. Update docs/ARQUITETURA.md with summary

## Output
- Architecture documentation in docs/ARQUITETURA/
- Database migrations if needed
- API contracts if applicable

## Context
${params.context?.projectName ? `Project: ${params.context.projectName}` : ''}
${params.context?.prdPath ? `PRD Reference: ${params.context.prdPath}` : ''}

---
Execute this task following Empire Vibe Coding protocols.`;
  },

  DEVELOPER: (params) => {
    const protocol = params.protocol ? `Siga o protocolo em vibe-coding/PROTOCOLOS/${params.protocol}` : '';
    return `# Task: ${params.subject}

## Description
${params.description}

## Agent: DEVELOPER
${protocol}

## Instructions
1. Implement the code according to architecture specifications
2. Follow existing code patterns in the project
3. Write clean, maintainable code
4. Add appropriate error handling
5. Update tests if applicable

## Prerequisites Checklist
- [ ] Architecture documented in docs/ARQUITETURA/
- [ ] Design specs available (if UI work)
- [ ] Clear understanding of requirements

## Output
- Working implementation
- Updated documentation if API changes

## Context
${params.context?.projectName ? `Project: ${params.context.projectName}` : ''}
${params.context?.architecturePath ? `Architecture: ${params.context.architecturePath}` : ''}
${params.context?.designPath ? `Design: ${params.context.designPath}` : ''}

---
Execute this task following Empire Vibe Coding protocols.`;
  },

  REVIEWER: (params) => {
    const protocol = params.protocol ? `Siga o protocolo em vibe-coding/PROTOCOLOS/${params.protocol}` : '';
    return `# Task: ${params.subject}

## Description
${params.description}

## Agent: REVIEWER
${protocol}

## Review Checklist
- [ ] Code follows project patterns
- [ ] No security vulnerabilities
- [ ] Proper error handling
- [ ] Code is readable and maintainable
- [ ] No unnecessary complexity
- [ ] Tests are adequate
- [ ] Documentation is updated

## Output
- Review comments
- Approval or change requests
- Summary of findings

---
Execute this task following Empire Vibe Coding protocols.`;
  },

  QA: (params) => {
    const protocol = params.protocol ? `Siga o protocolo em vibe-coding/PROTOCOLOS/${params.protocol}` : '';
    return `# Task: ${params.subject}

## Description
${params.description}

## Agent: QA
${protocol}

## Testing Checklist
- [ ] Happy path works correctly
- [ ] Edge cases handled
- [ ] Error states tested
- [ ] Performance acceptable
- [ ] Cross-browser/device testing (if UI)
- [ ] Integration tests pass

## Output
- Test results
- Bug reports (if any)
- Pass/Fail status

---
Execute this task following Empire Vibe Coding protocols.`;
  },

  SECURITY: (params) => {
    const protocol = params.protocol ? `Siga o protocolo em vibe-coding/PROTOCOLOS/${params.protocol}` : '';
    return `# Task: ${params.subject}

## Description
${params.description}

## Agent: SECURITY
${protocol}

## Security Checklist
- [ ] Input validation
- [ ] Authentication/Authorization
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Sensitive data handling
- [ ] Rate limiting
- [ ] Audit logging

## Output
- Security audit report
- Vulnerability findings
- Recommendations

---
Execute this task following Empire Vibe Coding protocols.`;
  },

  DESIGNER: (params) => {
    const protocol = params.protocol ? `Siga o protocolo em vibe-coding/PROTOCOLOS/${params.protocol}` : '';
    return `# Task: ${params.subject}

## Description
${params.description}

## Agent: DESIGNER
${protocol}

## Design Checklist
- [ ] Consistent with design system
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Responsive design
- [ ] Proper color contrast
- [ ] Clear visual hierarchy
- [ ] Consistent spacing
- [ ] Proper typography

## Output
- Design specifications
- Component designs
- Design tokens (if new)
- Documentation in docs/DESIGN/

---
Execute this task following Empire Vibe Coding protocols.`;
  },

  DATA: (params) => {
    const protocol = params.protocol ? `Siga o protocolo em vibe-coding/PROTOCOLOS/${params.protocol}` : '';
    return `# Task: ${params.subject}

## Description
${params.description}

## Agent: DATA
${protocol}

## Data Checklist
- [ ] Data model defined
- [ ] Relationships documented
- [ ] Indexes planned
- [ ] Migration strategy
- [ ] Data validation rules
- [ ] Privacy considerations

## Output
- Data schema
- Migration files
- Documentation in docs/ARQUITETURA/

---
Execute this task following Empire Vibe Coding protocols.`;
  },
};

// Generate terminal prompt for a task
export function generateTerminalPrompt(params: PromptParams): string {
  const generator = AGENT_PROMPTS[params.agent];
  return generator(params);
}

// Generate a simple one-liner prompt
export function generateSimplePrompt(params: PromptParams): string {
  const protocolHint = params.protocol ? ` Use protocol ${params.protocol}.` : '';
  return `Execute ${params.agent} task: ${params.subject}.${protocolHint} ${params.description}`;
}

// Generate Claude CLI command
export function generateClaudeCommand(params: PromptParams): string {
  const prompt = generateSimplePrompt(params);
  return `claude "${prompt.replace(/"/g, '\\"')}"`;
}

// Available prompt formats
export type PromptFormat = 'full' | 'simple' | 'claude-cli';

// Get prompt in specified format
export function getPrompt(params: PromptParams, format: PromptFormat = 'full'): string {
  switch (format) {
    case 'simple':
      return generateSimplePrompt(params);
    case 'claude-cli':
      return generateClaudeCommand(params);
    case 'full':
    default:
      return generateTerminalPrompt(params);
  }
}
